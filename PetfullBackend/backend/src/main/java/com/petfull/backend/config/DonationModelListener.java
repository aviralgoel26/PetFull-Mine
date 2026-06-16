package com.petfull.backend.config;

import com.petfull.backend.model.Donation;
import com.petfull.backend.service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

@Component
public class DonationModelListener extends AbstractMongoEventListener<Donation> {

    private final SequenceGeneratorService sequenceGenerator;

    @Autowired
    public DonationModelListener(SequenceGeneratorService sequenceGenerator) {
        this.sequenceGenerator = sequenceGenerator;
    }

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Donation> event) {
        if (event.getSource().getId() == null || event.getSource().getId() < 1) {
            event.getSource().setId(sequenceGenerator.generateSequence(Donation.SEQUENCE_NAME));
        }
    }
}
